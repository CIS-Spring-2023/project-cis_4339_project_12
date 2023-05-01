const express = require('express')
const router = express.Router()
const org = process.env.ORG

// importing data model schemas
const { services } = require('../models/models')

// GET up to 50 most recent services for org
router.get('/', (req, res, next) => {
  services
    .find((error, data) => {
      if (error) {
        return next(error)
      } else {
        return res.json(data)
      }
    })
    .sort({ updatedAt: -1 })
    .limit(50)
})

// GET entries based on search query
// Ex: '...?name=Bob&status=true&searchBy=name'
router.get('/search', (req, res, next) => {
  const dbQuery = { orgs: org }
  switch (req.query.searchBy) {
    case 'name':
      dbQuery.status = { $regex: `^${req.query.val}`, $options: 'i' }
      break
    case 'status':
      dbQuery.status = req.query.val
      break
    default:
      return res.status(400).send('invalid searchBy')
  }
  services.find(dbQuery, { orgs: org }, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// GET service by ID
router.get('/id/:id', (req, res, next) => {
  // use findOne instead of find to not return array
  services.findOne({ _id: req.params.id, orgs: org }, (error, data) => {
    if (error) {
      return next(error)
    } else if (!data) {
      res.status(400).send('Service not found')
    } else {
      res.json(data)
    }
  })
})

// POST new service
router.post('/', (req, res, next) => {
  const newService = req.body
  newService.orgs = [org]
  services.create(newService, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// PUT update services
router.put('/update/:id', (req, res, next) => {
  services.findByIdAndUpdate(req.params.id, req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })

})

// hard DELETE services by ID, as per project specifications
router.delete('/:id', (req, res, next) => {
  services.findByIdAndDelete(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else if (!data) {
      res.status(400).send('Client not found')
    } else {
      res.send('Client deleted')
    }
  })
})

// PUT remove service from event
// router.put('/deregister', (req, res, next) => {
//   services.findByIdAndUpdate(
//     req.query.service,
//     { $pull: { services: req.query.service } },
//     (error, data) => {
//       if (error) {
//         console.log(error)
//         return next(error)
//       } else {
//         res.send('Service deregistered with event')
//       }
//     }
//   )
// })

module.exports = router
