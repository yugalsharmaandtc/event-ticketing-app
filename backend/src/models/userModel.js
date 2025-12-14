const pool=require("../config/db");

// Function to create a new user
async function findOrCreateUser({name,email,phone}){
    const client=await pool.connect();
    try{
        // Check if user already exists
        await client.query('BEGIN');

        let user;

        if(email){
            const existing=await client.query("select * from users where email=$1 LIMIT 1",[email]);
            if(existing.rows.length>0){
                user=existing.rows[0];
            }

            if(!user && phone){
                const newUser=await client.query("INSERT INTO users(name,email,phone) VALUES ($1,$2,$3) RETURNING *",[name,email || null,phone || null]);
                user=newUser.rows[0];
            }
        }
            await client.query('COMMIT');
            return user;
        } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function getUserById(Id){
    const res=await pool.query("SELECT * FROM users WHERE id=$1",[Id]);
    return res.rows[0];
}  
// Added when added authentication and signup/signin
async function createUser({name, email, phone, password_hash}) {
  const result = await pool.query(
    `INSERT INTO users (name, email, phone, password_hash)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
    [name, email, phone, password_hash]
  );
  return result.rows[0];
}

async function getUserByEmail(email) {
  const result = await pool.query(
    `SELECT * FROM users WHERE email=$1`,
    [email]
  );
  return result.rows[0];
}

module.exports = {
  findOrCreateUser,
  getUserById,
  createUser,
  getUserByEmail,
};