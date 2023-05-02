const {knex} = require("../service/instance");
const {isValidEmail} = require("../utils/validateFormat");
const {findAddress} = require("./../utils/findAdress");

async function listClients(req, res) {
  try {
    const clients = await knex("client").returning("*");

    return res.status(200).json(clients);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

async function registerClient(req, res) {
  const {name, email, cpf, phone, cep, complement} = req.body;

  if (!name || !email || !cpf || !phone) {
    return res.status(401).json("Todos os campos são obrigatórios!");
  }

  if (!isValidEmail(email)) {
    return res.status(400).json("Informe um email válido");
  }
  try {
    const existingEmail = await knex("client").where({email}).first();
    const existingcpf = await knex("client").where({cpf}).first();

    if (existingEmail) {
      return res.status(400).json("Email já cadastrado");
    } else if (existingcpf) {
      return res.status(400).json("CPF já cadastrado");
    }

    const {
      logradouro: street,
      bairro: neighborhood,
      localidade: city,
      uf
    } = await findAddress(cep);

    let client;
    if (!cep) {
      client = await knex("client")
        .insert({
          name,
          email,
          cpf,
          phone
        })
        .returning("*");
      if (!client) {
        return res.status(400).json("Erro ao cadastrar cliente");
      }
    } else {
      client = await knex("client")
        .insert({
          name,
          email,
          cpf,
          phone,
          cep,
          street,
          complement,
          neighborhood,
          city,
          uf
        })
        .returning("*");
    }
    return res.status(200).json("Cliente cadastrado com sucesso!");
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

async function detailClient(req, res) {
  const {id} = req.params;

  try {
    const invoices = await knex
      .select("*")
      .from("client")
      .leftJoin("invoices", "client.id", "invoices.client_id")
      .where("client.id", id)
      .orderBy("invoices.due_date", "asc");

    const user = {
      name: invoices[0].name,
      email: invoices[0].email,
      cpf: invoices[0].cpf,
      phone: invoices[0].phone,
      cep: invoices[0].cep,
      street: invoices[0].street,
      complement: invoices[0].complement,
      neighborhood: invoices[0].neighborhood,
      city: invoices[0].city,
      uf: invoices[0].uf,
      extract: []
    };

    invoices.map(invoice => {
      user.extract.push({
        id: invoice.id,
        description: invoice.description,
        status: invoice.status,
        invoice_value: invoice.invoice_value,
        due_date: invoice.due_date,
        client_id: invoice.client_id
      });
    });
    res.json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

async function updateClient(req, res) {
  const {id, name, email, cpf, phone, cep, complement} = req.body;
  if (!id || !name || !email || !cpf || !phone) {
    return res.status(401).json("Todos os campos são obrigatórios!");
  }
  if (!id) {
    return res.status(401).json("Id é obrigatórios!");
  }
  if (!name) {
    return res.status(401).json("Name é obrigatórios!");
  }
  if (!email) {
    return res.status(401).json("E-mail é obrigatórios!");
  }
  if (!cpf) {
    return res.status(401).json("Cpf é obrigatórios!");
  }
  if (!phone) {
    return res.status(401).json("Phone é obrigatórios!");
  }

  if (!isValidEmail(email)) {
    return res.status(400).json("Informe um email válido");
  }

  try {
    const existingEmail = await knex("client")
      .whereNot({id})
      .andWhere({email})
      .first();

    const existingcpf = await knex("client")
      .whereNot({id})
      .andWhere({cpf})
      .first();

    if (existingEmail) {
      return res.status(400).json("Email já cadastrado");
    } else if (existingcpf) {
      return res.status(400).json("CPF já cadastrado");
    }

    const {
      logradouro: street,
      bairro: neighborhood,
      localidade: city,
      uf
    } = await findAddress(cep);

    const updatedClient = await knex("client")
      .where({id})
      .update({
        name,
        email,
        cpf,
        phone,
        cep,
        street,
        complement,
        neighborhood,
        city,
        uf
      })
      .returning("*");

    if (!updatedClient) {
      return res.status(400).json("Erro ao atualizar cliente");
    }

    return res.status(200).json("Cliente atualizado com sucesso!");
  } catch (error) {
    return res.status(400).json(error.message);
  }
}
 async function updateClientState(req,res){
  const {id} = req.params
  const {state} = req.query
try {
  
  await knex("client").where({id: 1}).update({state: "inadimplente"});
 return  res.status(200)
} catch (error) {
  
}
 }
module.exports = {registerClient, listClients, updateClient, detailClient};
