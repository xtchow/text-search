import redis from '../../models/redis';
const { createFile, searchFiles, everything } = redis;

const path = 'src/pages/api/redis.js';

export default async function ({method, body, query}, res) {

  switch (method) {
    case 'POST':
      console.log('body', body);
      const id = await createFile(body);
      console.log('id', id);
      return res.status(200).json({ id });
      break;
    case 'GET':
      // console.log('query', query);
      const {q} = query;
      // console.log('q', q);
      if (q === undefined) {
        console.log('in if!');
        const total = await everything();
        console.log('total', total, typeof total, Array.isArray(total), total.length);
        return res.status(200).json({ total });
      } else {
        console.log('in else');
        const results = await searchFiles(q);
        console.log('L26 results', results);
        return res.status(200).json({ results });
      }
      break;
    default:
      console.log(`in default of ${path}.`);
  }
}