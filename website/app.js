
const apiKey = 'd9acfd94f6cc474e1be2ab599b9e1e0a'; // Replace with your OpenWeatherMap API key
let dataFetched = false; // تتبع متغير للتحقق مما إذا تم استرجاع البيانات من الخادم

document.getElementById('generate').addEventListener('click', () => {
    const zipCode = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;

    getWeatherData(zipCode, apiKey)
        .then((data) => {
            const temperature = data.main.temp;
            const date = new Date().toLocaleDateString();

            // Make POST request to server with fetched data
            return postData('/add', { date, temperature, feelings });
        })
        .then(() => {
            // بعد الانتهاء من إرسال البيانات، تعيين dataFetched إلى true
            dataFetched = true;
            // الآن يمكن تحديث الواجهة
            updateUI();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

async function getWeatherData(zipCode, apiKey) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);

    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Unable to fetch weather data.');
    }
}

async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Error posting data.');
    }
}

async function updateUI() {
    // فقط قم بتحديث الواجهة إذا كانت البيانات قد استرجعت بنجاح من الخادم
    if (dataFetched) {
        const response = await fetch('/get');

        try {
            const data = await response.json();
            document.getElementById('date').textContent = `Date: ${data.date}`;
            document.getElementById('temp').textContent = `Temperature: ${data.temperature}°C`;
            document.getElementById('content').textContent = `Feeling: ${data.feelings}`;
        } catch (error) {
            console.error('Error updating UI:', error);
        }
    }
}

// Initial call to update UI
updateUI();
