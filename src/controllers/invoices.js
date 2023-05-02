const {knex} = require("../service/instance");

async function addInvoices(req, res) {
  const {description, status, invoice_value, due_date, client_id} = req.body;
  try {
    await knex("invoices").insert({
      description,
      status,
      invoice_value,
      due_date: due_date,
      client_id: client_id
    });

    res.json("Dados inseridos com sucesso!");
  } catch (error) {
    res.status(400).json(error);
  }
}
async function listInvoices(req, res) {
  try {
    const invoices = await knex
      .select(
        "invoices.id",
        "invoices.description",
        "invoices.status",
        "invoices.invoice_value",
        "invoices.due_date",
        "client.name as client_name",
        "client.email as client_email",
        "client.id as client_id"
      )
      .from("invoices")
      .join("client", "invoices.client_id", "=", "client.id");

    res.json(invoices);
  } catch (error) {
    notifyError(error.response.data);
  }
}
async function editInvoice(req, res) {
  const {id} = req.params;
  const {description, status, invoice_value, due_date} = req.body;
  try {
    await knex("invoices")
      .where({id})
      .update({
        description,
        status,
        invoice_value,
        due_date: new Date(due_date)
      });

    res.json("Dados atualizados com sucesso!");
  } catch (error) {
    res.json(error);
  }
}

async function deleteInvoice(req, res) {
  const {id} = req.params;
  const {client_id} = req.query;
  try {
    const invoice = await knex("invoices").where({id, client_id}).first();
    if (!invoice) {
      return res.status(400).json("Transação não encontrada");
    }

    const deleted = await knex("invoices").where({id}).del();

    if (deleted) {
      return res.status(202).json("Transação deletada");
    } else {
      res.json("Erro ao deletar transação");
    }
  } catch (error) {
    return res.status(400).json(error);
  }
}

module.exports = {addInvoices, listInvoices, editInvoice, deleteInvoice};
