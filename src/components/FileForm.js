import {
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  Box
} from '@chakra-ui/react';

import { useState } from 'react';


export default function FileForm() {
  // const [items, setItems] = useState([]);

  return (<>
    <form>
      <input type="file" id="file-input" multiple onChange={async function(e) {
        const FileList = e.target.files;
        console.log('FileList', FileList);

        // const form = new FormData(e.target);
        // console.log('form', form);
        // const formData = Object.fromEntries(new Map([
        //   ['foo', 'bar'],
        //   ['baz', 42]
        // ]));

        for (let i = 0; i < FileList.length; i++) {
          const file = FileList[i];
          const {lastModifiedDate, name, type} = file;

          const isTxt = (type === 'text/plain');
          if (isTxt) {
            const format = name.split('.').slice(0, -1);
            console.log('format', format);

            const data = {
              modified: lastModifiedDate,
              name: (format.length > 1) ? format.join('.') : format[0],
              mime: type,
              text: await file.text()
            };
            console.log('data', data);

            const res = await fetch('/api/redis', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
            const result = await res.json();
            console.log('result', result);

          } else {
            // alert();
            console.log(i, await file.text());
          }
        }
      }}/>

      {/* <Accordion>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex='1' textAlign='left'>0613.txt</Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.
          </AccordionPanel>
        </AccordionItem>


      </Accordion> */}
    </form>
  </>);
}