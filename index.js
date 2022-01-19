import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'

const app = express()
app.set('view engine', 'pug')

app.use(helmet())
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method
    delete req.body._method
    return method
  }
}))

export default config => {
  const products = [
    { title: 'Awesome Product 1', prize: '17.99', id: 1 },
    { title: 'Awesome Product 2', prize: '112.99', id: 2 },
    { title: 'Awesome Product 3', prize: '9.99', id: 3 }
  ]
  let comparison = []

  app.get('/', (req, res) => {
    res.render('index', { products })
  })

  app.get('/comparison', (req, res) => {
    res.render('comparison', { products: comparison })
  })

  app.post('/comparison', (req, res) => {
    const { product: productParam } = req.body

    if (isNaN(productParam)) {
      console.log('invalid product id pushed for comparison', productParam)
    }

    const productId = parseInt(productParam)

    if (!comparison.find(p => p.id === productId)) {
      const product = products.find(p => p.id === productId)
      if (product) {
        comparison.push(product)
      }
    }

    res.redirect('/comparison')
  })

  app.delete('/comparison/:id', (req, res) => {
    const { id } = req.params

    if (isNaN(id)) {
      console.log('invalid product id pushed for comparison', id)
    }

    const productId = parseInt(id)

    const product = comparison.find(p => p.id === productId)

    if (product) {
      comparison = comparison.filter(p => p.id !== productId)
    }

    res.redirect('/comparison')
  })

  return app
}
