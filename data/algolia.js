import algoliasearch from "algoliasearch";
import { config } from 'dotenv';
config();

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);

//client.deleteIndex('test_dev'); //flush index

export const productIndex = client.initIndex('products');
export const orderIndex = client.initIndex('orders');
export const orderInfoIndex = client.initIndex('orderInfoes');
export const vendorIndex = client.initIndex('vendors');
export const customerIndex = client.initIndex('customers');