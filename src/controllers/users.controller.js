import { db } from '../database/database.connection.js';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

export async function signUp(req, res) {
  const { name, email, password } = req.body;

  try {
    const user = await db.collection('users').findOne({ email });
    if (user) return res.status(409).send('E-mail already registered!');

    const hash = bcrypt.hashSync(password, 10);

    await db.collection('users').insertOne({ name, email, password: hash });

    return res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function signIn(req, res) {
  const { email, password } = req.body;

  try {
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(404).send('E-mail not registered');
    }

    const isRightPassword = bcrypt.compareSync(password, user.password);

    if (!isRightPassword) {
      return res.status(401).send('Incorrect password');
    }

    const token = uuid();
    await db.collection('sessions').insertOne({ userId: user._id, token });

    return res.status(200).send({ token: token });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function logout(req, res) {
  const { authorization } = req.headers;

  const token = authorization?.replace('Bearer ', '');

  if (!token) {
    return res.sendStatus(404);
  }

  try {
    await db.collection('sessions').deleteOne({ token });

    return res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
