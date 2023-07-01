const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "db.puyzcmbyvfmegyfbvpnz.supabase.co",
  database: "postgres",
  password: "dbsegurancadb",
  port: 5432,
  // ssl: { rejectUnauthorized: false },
});

const getUsers = async (request, response) => {
  const { name } = request.query;
  // let filter = name ?? "";

  // const query = {
  //   name: "list-users",
  //   text: `SELECT id, name, email FROM users WHERE name ilike $1 ORDER BY id ASC`,
  //   values: ["%" + filter + "%"],
  // };
  // console.log(query);
  // pool.query(query, (error, results) => {
  //   console.log(error, results);
  //   if (error) {
  //     return response.status(500).send(error);
  //   }
  //   return response.status(200).json(results.rows);
  // });
  // console.log(res.rows[0])

  pool.query(
    "SELECT id, name, email FROM users WHERE name ilike '%" +
      name +
      "%' ORDER BY id ASC",
    (error, results) => {
      if (error) {
        return response.status(500).send(error);
      }
      console.log(results);
      return response.status(200).json(results.rows);
    }
  );
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "SELECT id, name, email, password FROM users WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        return response.status(500).send(error);
      }
      return response.status(200).json(results.rows[0]);
    }
  );
};

const login = (request, response) => {
  const { email, password } = request.body;

  pool.query(
    "SELECT id, name, email from users WHERE email = $1 AND password = $2",
    [email, password],
    (error, result) => {
      if (error) {
        response.status(500).send(error);
      }
      // console.log(
      //   `SELECT id, name, email from users WHERE email = '${email}' AND password = '${password}'`
      // );
      // console.log(result.rows);
      if (result.rows.length == 0) {
        return response.status(500).send({ message: "Usuário não encontrado" });
      } else if (!!result.rows && result.rows.length === 1) {
        return response.status(201).send(result.rows[0]);
      }
    }
  );
};

const createUser = (request, response) => {
  const { name, email, password } = request.body;

  pool.query(
    'INSERT INTO users (name, email, password, "createdAt", "updatedAt") VALUES ($1, $2, $3, now(), now()) RETURNING *',
    [name, email, password],
    (error, results) => {
      if (error) {
        return response.status(500).send(error);
      }
      return response.status(201).send(results.rows[0]);
    }
  );
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    'UPDATE users SET name = $1, email = $2, "updatedAt" = now() WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        return response.status(500).send(error);
      }
      return response.status(200).send(results.rows[0]);
    }
  );
};
const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(results.rows[0]);
  });
};

const getLogs = (request, response) => {
  const { action } = request.query;

  pool.query(
    `SELECT logs.id, action, user_id, users.name as user_name FROM logs LEFT JOIN users ON user_id = users.id ${
      "WHERE action ilike '%" + action + "%'"
    } ORDER BY id ASC`,
    (error, results) => {
      if (error) {
        return response.status(500).send(error);
      }
      return response.status(200).json(results.rows);
    }
  );
};

const getLogById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM logs WHERE id = $1", [id], (error, results) => {
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).json(results.rows[0]);
  });
};

const getLogByUserId = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "SELECT * FROM logs WHERE user_id = $1",
    [id],
    (error, results) => {
      if (error) {
        return response.status(500).send(error);
      }
      return response.status(200).json(results.rows);
    }
  );
};

const createLog = (request, response) => {
  const { action, user_id } = request.body;

  pool.query(
    'INSERT INTO logs (action, user_id, "createdAt", "updatedAt") VALUES ($1, $2, now(), now()) RETURNING *',
    [action, user_id],
    (error, results) => {
      if (error) {
        return response.status(500).send(error);
      }
      return response.status(201).send(results.rows[0]);
    }
  );
};

const updateLog = (request, response) => {
  const id = parseInt(request.params.id);
  const { action, user_id } = request.body;

  pool.query(
    `UPDATE logs SET ${!!action && "action = $1,"}  ${
      !!user_id && " user_id = $2, "
    }  "updatedAt" = now() WHERE id = $3 
    `,
    [action, user_id, id],
    (error, results) => {
      if (error) {
        return response.status(500).send(error);
      }
      return response.status(200).send(results.rows[0]);
    }
  );
};
const deleteLog = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM logs WHERE id = $1", [id], (error, results) => {
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(results.rows[0]);
  });
};

const getItems = (request, response) => {
  const { title } = request.query;

  pool.query(
    `SELECT * FROM items ${
      "WHERE title ilike '%" + title + "%' AND id !=" + 6
    } ORDER BY id ASC`,
    (error, results) => {
      if (error) {
        return response.status(500).send(error);
      }
      return response.status(200).json(results.rows);
    }
  );
};

const getItemById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM items WHERE id = $1", [id], (error, results) => {
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).json(results.rows[0]);
  });
};

const createItem = (request, response) => {
  const { title, description, price, quantity } = request.body;

  pool.query(
    'INSERT INTO items (title, description, price, quantity, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, now(), now()) RETURNING *',
    [title, description, price, quantity],
    (error, results) => {
      if (error) {
        return response.status(500).send(error);
      }
      if (results.rows.length > 0) {
        return response.status(201).send(results.rows[0]);
      } else
        return response.status(400).send({ message: "Não foi possível criar" });
    }
  );
};

const updateItem = (request, response) => {
  const id = parseInt(request.params.id);
  const { title, description, quantity } = request.body;

  pool.query(
    `UPDATE items SET title = $1, description = $2, quantity = $3, "updatedAt" = now() WHERE id = $4`,
    [title, description, quantity, id],
    (error, results) => {
      if (error) {
        return response.status(500).send(error);
      }
      return response.status(200).send(results.rows[0]);
    }
  );
};
const deleteItem = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM items WHERE id = $1", [id], (error, results) => {
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(results.rows[0]);
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getLogs,
  getLogById,
  getLogByUserId,
  createLog,
  updateLog,
  deleteLog,
};
