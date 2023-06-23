import { useState, useRef, useEffect } from 'react';
import {
  FormControl, FormLabel, FormErrorMessage, FormHelperText,
  Button,
  Input, IconButton, Highlight,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  Box
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';


export default function SearchBox() {
  const [cache, setCache] = useState({});
  const [hits, setHits] = useState([]);

  useEffect(() => {
    (async function() {


      const track = localStorage.getItem('CACHE');
      if (track) {

        setCache(JSON.parse(track));
      } else {
        const res = await fetch('/api/redis?');
        const { total } = await res.json();
        const options = { ALL: total };
        localStorage.setItem('CACHE', JSON.stringify(options));
        setCache(options);
      }
      // const options = (track) ? JSON.parse(track) : {};
      // options.ALL = total;
      // localStorage.setItem('CACHE', JSON.stringify(options));

      setHits(cache.ALL);
      console.log('cache', cache.ALL);
      console.log('hits', hits);
    })();
  }, []);

  const format = function(increments, original, value) {
    return increments.reduce(([str, edit], inc, index) => {
      const size = (value + inc.length);
      const [front, theRest] = [str.slice(0, size), str.slice(size)];
      const [noFix, toFix] = [front.slice(0, inc.length), front.slice(-value)];
      edit.push(noFix, <Highlight key={index} query={toFix} styles={{ px: '1', py: '1', bg: 'orange.100' }}>
        {toFix}</Highlight>);

      return [theRest, edit];
    }, [original, []])[1];
  };

  let chars = '';
  const search = async (e) => {
    const q = e.target.value;
    const hasGrowth = (q.length > chars.length);
    chars = q;

    if (q.length <= 0) {
      setHits(cache.ALL);
    } else if (hasGrowth && (q.length > 2)) {
      const lowered = q.toLowerCase();

      const find = Object.keys(cache).filter((term) => { return (term.toLowerCase() == lowered); });
      if (find.length > 0) {
        setHits(find.map((term) => { return cache[term]; }));
      } else {
        const params = new URLSearchParams({ q });
        const res = await fetch('/api/redis?' + params);
        let { results } = await res.json();
        // console.log('results', results, typeof results, Array.isArray(results));
        if (results.length > 0) {
          results = results.map(({ entityId, modified, mime, name, text }) => {
            return { entityId, modified, mime,
              name: format(name.toLowerCase().split(lowered), name, q.length),
              text: format(text.toLowerCase().split(lowered), text, q.length)
            };
          });

          cache[q] = results;
          localStorage.setItem('CACHE', JSON.stringify(cache));
          setCache(cache);
          setHits(results);

        }

      }

    }

  };


  return(<>
    <FormControl>
      {/* <FormLabel>Email address</FormLabel> */}
      <Input type="text" placeholder="type here..." aria-label="Search Redis" onChange={search}/>
      {/* <CloseButton /> */}
      {/* <IconButton aria-label="Search Redis" icon={<SearchIcon />} onClick={save} /> */}
      {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
    </FormControl>

    {/* <div>
      {Object.keys(cache) && Object.keys(cache).map((name, index) => {
        <Button colorScheme='teal' variant='ghost' key={index} onClick={(e) => {
          console.log('e.value', e.value);
        }}>{name}</Button>
      })}

    </div> */}


    <Accordion>
      {hits && hits.map((hit) => (
        <AccordionItem key={hit.entityId}>
          <h2>
            <AccordionButton>
              <Box as="span" flex='1' textAlign='left'>{hit.name}</Box>
              <AccordionIcon/>
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>{hit.text}</AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>

  </>);
}
