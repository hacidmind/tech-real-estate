import clientPromise from "../../lib/mongodb";

export default async (req, res) => {

    const client = await clientPromise
    const database = client.db('sample_airbnb')

    const data = await database.collection('listingsAndReviews')
        .find({})
        .limit(20)
        .toArray();

    res.json(data);
    
};