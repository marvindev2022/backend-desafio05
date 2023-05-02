const express = require("express");
const {registerUser, userLogin, userUpdate} = require("../controllers/user");
const {
  registerClient,
  listClients,
  updateClient,
  detailClient
} = require("../controllers/client");
const {validateToken} = require("../middlewares");
const {
  listInvoices,
  addInvoices,
  editInvoice,
  deleteInvoice
} = require("../controllers/invoices");

const router = express();

router.get("/", (req, res) => res.json("Inimigos do front"));
router.post("/user", registerUser);
router.post("/login", userLogin);

router.use(validateToken);

router.put("/user", userUpdate);
router.post("/client", registerClient);
router.get("/clients", listClients);
router.get("/client/:id", detailClient);
router.put("/client", updateClient);

router.get("/invoices", listInvoices);
router.post("/invoice", addInvoices);
router.put("/invoice/:id", editInvoice);
router.delete("/invoice/:id", deleteInvoice);

module.exports = router;
