const jwt = require('jsonwebtoken')
console.log('jwt', jwt)

const config = { jwtSecret: 'test' }
const user = { id: 5, name: 'nick', password: 'test1' }
const user2 = { id: 5, name: 'mike', password: 'test2' }

// users database
const users = { 5: user, 6: user2 }
const usersByName = {'nick' : user, 'mike': user2 }

function login(username, password) {
  const loggingInUser = usersByName[username]
  if (!loggingInUser) {
    throw 'No user with that name'
  }

  // TODO use encryption to compare only password HASH with hash stored in DB
  // https://www.npmjs.com/package/bcrypt
  if (loggingInUser.password != password) {
    throw 'Invalid password'
  }

  console.log('login successful')
  // Build a JWT for the user
  let token = jwt.sign({ userId: loggingInUser.id }, config.jwtSecret, {
    expiresIn: 60
  });

  console.log('token', token)
  return token
}

function apiCall(request) {
  const authToken = request.headers['X-AUTH-TOKEN']
  console.log('request!', request, 'auth token', authToken)
  try {
    const { userId } = jwt.verify(token, config.jwtSecret);
    const user = users[userId]
    if (!user) {
      throw 'No user'
    }
    return user
  } catch(err) {
    console.err(err)
    throw 'Had a problem decoding the payload'
  }
}

// TODO talk about expirations

const token = login('nick', 'test1')
const request = {
  headers: {
    'X-AUTH-TOKEN': token
  },
  path: '/testUserIsLoggedIn',
  body: {
    hello: 'world'
  }
}

const loggedInUser = apiCall(request)
console.log('user successfully authenticated', loggedInUser)
