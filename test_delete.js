const url = 'http://localhost:5153';

async function run() {
  try {
    // 1. Register a test user
    console.log("Registering");
    const regRes = await fetch(`${url}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: 'T', lastName: 'T', email: `test${Date.now()}@t.com`, password: 'Password123!' })
    });
    const regData = await regRes.json();
    const token = regData.token;
    console.log("Token:", token.substring(0, 10) + '...');

    // 2. Create card
    console.log("Creating card");
    const createRes = await fetch(`${url}/api/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ templateId: 'b1', recipientName: 'test', heading: 'test', message1: 'test', message2: '', footer: 'test' })
    });
    const cardData = await createRes.json();
    const cardId = cardData.id;
    console.log("Created card:", cardId);

    // 3. Delete card
    console.log("Deleting card:", cardId);
    const delRes = await fetch(`${url}/api/cards/${cardId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log("Delete status:", delRes.status);
    
    // 4. Verify deletion
    const verifyRes = await fetch(`${url}/api/cards/user`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const cards = await verifyRes.json();
    console.log("User cards after deletion:", cards.length);

  } catch(e) {
    console.error(e);
  }
}

run();
