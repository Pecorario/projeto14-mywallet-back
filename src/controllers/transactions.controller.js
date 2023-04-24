import { db } from '../database/database.connection.js';
import dayjs from 'dayjs';

export async function addTransaction(req, res) {
  const { value, description } = req.body;
  const { type } = req.params;
  const { authorization } = req.headers;

  const token = authorization?.replace('Bearer ', '');

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const session = await db.collection('sessions').findOne({ token });
    if (!session) {
      return res.sendStatus(401);
    }

    const user = await db.collection('users').findOne({
      _id: session.userId
    });

    if (!user) {
      return res.sendStatus(404);
    }

    await db.collection('transactions').insertOne({
      userId: user._id,
      type,
      value,
      description,
      date: dayjs().format('DD/MM/YYYY')
    });

    return res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getTransactionsByToken(req, res) {
  const { authorization } = req.headers;

  const token = authorization?.replace('Bearer ', '');

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const session = await db.collection('sessions').findOne({ token });
    if (!session) {
      return res.sendStatus(401);
    }

    const user = await db.collection('users').findOne({
      _id: session.userId
    });

    if (!user) {
      return res.sendStatus(404);
    }

    const transactions = await db
      .collection('transactions')
      .find({
        userId: session.userId
      })
      .toArray();

    delete user.password;
    delete transactions.userId;

    const response = {
      ...user,
      transactions
    };

    return res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
