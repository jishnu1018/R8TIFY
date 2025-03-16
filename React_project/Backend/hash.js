import bcrypt from 'bcrypt';

async function hashPassword() {
    const password = "Admin@123"; // Your plain text password
    const saltRounds = 10; // Number of salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log("Encoded Password:", hashedPassword);
}

hashPassword();
