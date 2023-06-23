// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import redis from '../../models/redis';
const {createIndex} = redis;

export default async function handler(req, res) {
  // res.status(200).json({ name: 'John Doe' });

  await createIndex();
  res.status(200).send('ok');
}
