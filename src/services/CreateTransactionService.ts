import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';
import { getCustomRepository, getRepository } from 'typeorm';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}
class CreateTransactionService {
  public async execute({title, value, type, category}: Request): Promise<Transaction> {
    // TODO
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    if ( type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance')
    }

    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category
      }
    });

    if(!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category,
      });

    }

    await categoryRepository.save(transactionCategory);

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory
    })

    await transactionsRepository.save(transaction)

    return transaction;
  }
}

export default CreateTransactionService;
