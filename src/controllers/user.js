const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {knex} = require("./../service/instance");
const {isValidEmail} = require("../utils/validateFormat");
require("dotenv").config();

const registerUser = async (req, res) => {
  const {name, email, password} = req.body;

  if (!name || !email || !password) {
    return res.status(401).json("Todos os campos são obrigatórios!");
  }

  if (!isValidEmail(email)) {
    return res.status(400).json("Informe um email válido");
  }
  try {
    const existingEmail = await knex("users").where({email}).first();
    if (existingEmail) {
      return res.status(400).json("O email já existe");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await knex("users")
      .insert({
        name,
        email,
        password: encryptedPassword
      })
      .returning("*");

    if (!user[0]) {
      return res.status(400).json("Erro ao cadastrar usuário");
    }

    return res.status(200).json({...user[0]});
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const userLogin = async (req, res) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json("Todos os campos são obrigatórios!");
  }

  try {
    const loggedUser = await knex("users").where({email}).first();
    if (!loggedUser) {
      return res.status(400).json("E-mail não cadastrado!");
    }

    const comparePassword = await bcrypt.compare(password, loggedUser.password);

    if (!comparePassword) {
      return res.status(400).json("E-mail ou password inválidos");
    }
    const {password: _, ...user} = loggedUser;

    const token = jwt.sign(
      {id: user.id, name: user.name},
      process.env.JWT_SECRET,
      {
        expiresIn: "30d"
      }
    );
    return res.status(200).json({
      user,
      token
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const userUpdate = async (req, res) => {
  const {name, email, new_password, password_confirmation, cpf, phone} =
    req.body;
  const {id} = req.user;

  if (!name || !email) {
    return res.status(400).json("Este campo deve ser preenchido");
  }

  try {
    const checkEmail = await knex("users").where({email}).first();

    if (checkEmail && checkEmail.id !== id) {
      return res.status(400).json("E-mail já cadastrado");
    }

    if (!isValidEmail(email)) {
      return res.status(400).json("Informe um email válido");
    }

    let newPassword = "";
    const userSelected = await knex("users").where({id}).first();

    if (!new_password || new_password === "") {
      newPassword = userSelected.password;
    } else {
      if (!password_confirmation) {
        return res.status(400).json("Este campo deve ser preenchido");
      }

      if (new_password !== password_confirmation) {
        return res.status(400).json("As passwords não coincidem");
      }

      const encryptedPassword = await bcrypt.hash(new_password, 10);
      newPassword = encryptedPassword;
    }

    let newCpf = userSelected.cpf;

    if (cpf && cpf !== "") {
      const checkCpf = await knex("users").where({cpf}).first();

      if (checkCpf && checkCpf.id !== id) {
        return res.status(400).json("CPF já cadastrado");
      }

      if (cpf.length !== 11) {
        return res.status(400).json(cpf);
      }

      newCpf = cpf;
    }

    let newPhone = userSelected.phone;

    if (phone && phone !== "") {
      const checkPhone = await knex("users").where({phone}).first();

      if (checkPhone && checkPhone.id !== id) {
        return res.status(400).json("Telefone já cadastrado");
      }

      if (phone.length !== 11) {
        return res.status(400).json("Número de telefone inválido");
      }

      newPhone = phone;
    }

    const updatedUser = await knex("users")
      .where({id})
      .update({
        name,
        email,
        password: newPassword,
        cpf: newCpf,
        phone: newPhone
      })
      .returning("*");

    if (!updatedUser || !updatedUser[0]) {
      return res.status(400).json("Erro ao atualizar usuário");
    }

    return res.status(200).json(updatedUser[0]);
  } catch (error) {
    return res.json(error.message);
  }
};

module.exports = {registerUser, userLogin, userUpdate};
