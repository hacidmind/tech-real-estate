import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'

export async function getServerSideProps(context) {
  try {
    await clientPromise
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    const client = await clientPromise
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    const database = client.db('sample_airbnb')

    const data = await database.collection('listingsAndReviews')
      .find({})
      .limit(20)
      .toArray();
    const properties = JSON.parse(JSON.stringify(data));
    // console.log(properties);
    const filtered = properties.map(property => {
      const price = JSON.parse(JSON.stringify(property.price))

      return {
        _id: property._id,
        name: property.name,
        image: property.images.picture_url,
        address: property.address,
        summary: property.summary,
        guests: property.accommodates,
        price: price.$numberDecimal
      }
    })

    return {
      props: { properties: filtered },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

export default function Home({ properties }) {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossOrigin="anonymous" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-A3rJD856KowSb7dwlZdYEkO39Gagi7vIsF0jrRAoQmDKKtQBHUuLZ9AsSv4jD4Xa" crossOrigin="anonymous"></script>
      </Head>

      <main>
        <h1 className="mb-5 text-primary">
          Welcome to Tech Real Estate
        </h1>

        <div className="container-fluid">
          <div className="row">
            {properties && properties.map(property => (
              <div className='col-sm-6 col-md-4 my-4'>
                <div className="card h-100">
                  <img src={property.image} alt={property.name} width='auto' height="200" />
                  <div className="card-body">
                    <h5 className="card-title">{property.name} (Up to {property.guests}guests) </h5>
                    <p className="card-text">{property.summary} </p>
                    <p>${property.price}/Night </p>
                  </div>
                  <div className="card-footer border-success">
                    <div className="d-grid gap-2">
                      <a href={"listing/" + property._id} className="btn btn-primary">Details</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
