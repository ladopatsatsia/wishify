const url = 'http://localhost:5153';

async function run() {
  try {
    // 1. Register a test user
    console.log("Registering");
    const regRes = await fetch(`${url}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: 'G', lastName: 'G', email: `testget${Date.now()}@t.com`, password: 'Password123!' })
    });
    const regData = await regRes.json();
    const token = regData.token;

    // 2. Create card
    console.log("Creating card");
    const createRes = await fetch(`${url}/api/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ templateId: 'b1', recipientName: 'test', heading: 'Edited Heading', message1: 'Edited Msg', message2: '', footer: 'Edited' })
    });
    const cardData = await createRes.json();
    const cardId = cardData.id;
    console.log("Created card:", cardId);

    // 3. GET card
    console.log("Fetching GET /api/cards/" + cardId);
    const getRes = await fetch(`${url}/api/cards/${cardId}`);
    
    if (!getRes.ok) {
        console.error("GET failed with status:", getRes.status);
        console.error(await getRes.text());
        return;
    }
    const getData = await getRes.json();
    console.log("It worked! Heading:", getData.heading);

  } catch(e) {
    console.error(e);
  }
}

run();
