const url = 'http://localhost:5153/api/cards';
const payload = {
  templateId: 'bday-1',
  recipientName: 'Test',
  heading: 'Test',
  message1: 'Test',
  message2: '',
  footer: 'Test',
  audioUrl: null,
  customEmoji: '🎂',
  customBgGradient: 'test',
  giftBoxUrl: null,
  imagesJson: "[]"
};

console.log("Starting fetch to API...");
fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})
.then(async res => {
  console.log("STATUS:", res.status);
  const text = await res.text();
  console.log("BODY:", text);
})
.catch(err => {
  console.error("ERROR:", err);
});
