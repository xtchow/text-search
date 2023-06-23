import { Client, Entity, Schema } from 'redis-om';

const client = new Client();
const connect = async function() {
  if (!client.isOpen()) {
    await client.open(process.env.REDIS_URL);
  }
};

class File extends Entity {}
let fileSchema = new Schema(File, {
  modified: { type: 'date' },
  name: { type: 'string', textSearch: true },
  mime: { type: 'string' },
  text: { type: 'text', textSearch: true }
}, { dataStructure: "JSON" });

// class Redis {
//   constructor(el) {}

//   async createFile(data) {}
// }

const redis = {
  createFile: async function(data) {
    await connect();

    // https://stackoverflow.com/questions/71926028/redis-om-fastify-this-writeentity-is-not-a-function/71926517#71926517
    // const repo = new Repository(fileSchema, client);
    const repo = client.fetchRepository(fileSchema);
    const file = repo.createEntity(data);
    const id = await repo.save(file);
    return id;
  },
  createIndex: async function() {
    await connect();
    const repo = client.fetchRepository(fileSchema);
    await repo.createIndex();
  },
  searchFiles: async function(query) {
    await connect();

    const repo = client.fetchRepository(fileSchema);
    console.log('L44 repo', repo);
    const files = await repo.search()
      .where('name').eq(query)
      .or('text').matches(query)
      .return.all();
    return files;
  },
  everything: async function() {
    await connect();

    const repo = client.fetchRepository(fileSchema);
    const total = await repo.search().return.all();
    return total;
  }
};
export default redis;

