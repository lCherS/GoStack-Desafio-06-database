import { Router } from 'express';
import { getCustomRepository, Transaction } from 'typeorm';

 import TransactionsRepository from '../repositories/TransactionsRepository';
 import CreateTransactionService from '../services/CreateTransactionService';
 import DeleteTransactionService from '../services/DeleteTransactionService';
 import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  // TODO

  /**
   * listagem com todas as transações cadastradas até agora, junto do valr da soma de entradas e retiradas
   */
  /* formato:
    {
    "transactions": [
      {
        "id": "uuid",
        "title": "Salário",
        "value": 4000,
        "type": "income",
        "category": {
          "id": "uuid",
          "title": "Salary",
          "created_at": "2020-04-20T00:00:49.620Z",
          "updated_at": "2020-04-20T00:00:49.620Z"
        },
        "created_at": "2020-04-20T00:00:49.620Z",
        "updated_at": "2020-04-20T00:00:49.620Z"
      },
      {
        "id": "uuid",
        "title": "Freela",
        "value": 2000,
        "type": "income",
        "category": {
          "id": "uuid",
          "title": "Others",
          "created_at": "2020-04-20T00:00:49.620Z",
          "updated_at": "2020-04-20T00:00:49.620Z"
        },
        "created_at": "2020-04-20T00:00:49.620Z",
        "updated_at": "2020-04-20T00:00:49.620Z"
      },
      {
        "id": "uuid",
        "title": "Pagamento da fatura",
        "value": 4000,
        "type": "outcome",
        "category": {
          "id": "uuid",
          "title": "Others",
          "created_at": "2020-04-20T00:00:49.620Z",
          "updated_at": "2020-04-20T00:00:49.620Z"
        },
        "created_at": "2020-04-20T00:00:49.620Z",
        "updated_at": "2020-04-20T00:00:49.620Z"
      },
      {
        "id": "uuid",
        "title": "Cadeira Gamer",
        "value": 1200,
        "type": "outcome",
        "category": {
          "id": "uuid",
          "title": "Recreation",
          "created_at": "2020-04-20T00:00:49.620Z",
          "updated_at": "2020-04-20T00:00:49.620Z"
        },
        "created_at": "2020-04-20T00:00:49.620Z",
        "updated_at": "2020-04-20T00:00:49.620Z"
      }
    ],
    "balance": {
      "income": 6000,
      "outcome": 5200,
      "total": 800
    }
  }
*/
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();

  console.log(transactions);
  console.log(balance);
  return response.json({transactions, balance});

});

transactionsRouter.post('/', async (req, res) => {
  // TODO

    /**
   * receber: title, value, type, category (body)
   * type: tipo (income = depositos / outcome = saidas)
   * cadastrar no banco de dados: id, title, value, type, category_id, created_at, updated_at)
   *
   * antes de cadastrar verificar se o id da categoria ja existe
   *
   */
  const { title, value, type, category } = req.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category
  })
  console.log(transaction);
  return res.json(transaction);

});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(id);

  return response.status(204).send();
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
