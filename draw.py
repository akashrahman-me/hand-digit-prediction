import numpy as np
import base64
from io import BytesIO
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image, ImageOps
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)

# Load the trained model
model = load_model("mnist_model.keras")

def preprocess_image(image_data):
    base64_image = image_data.replace('data:image/png;base64,', '')
    image_data = base64.b64decode(base64_image)
    image = Image.open(BytesIO(image_data))
    r, g, b, alpha = image.split()
    white_background = Image.new('RGBA', image.size, (255, 255, 255, 255))  
    white_background.paste(image, (0, 0), alpha)
    image = ImageOps.invert(white_background.convert("RGB"))
    image = image.convert("L")

    # Resize to 28x28, the size expected by the model
    image = image.resize((28, 28))

    # Convert the image to a numpy array and normalize
    digit_array = np.array(image) / 255.0
    digit_array = digit_array.reshape(1, 28, 28)
    # print(digit_array)
    return digit_array

@app.route('/predict', methods=['POST'])
def predict():
    data_url = request.json['dataURL']
    digit_array = preprocess_image(data_url)
    prediction = model.predict(digit_array)
    predicted_digit = np.argmax(prediction)
    return jsonify({'predicted_digit': int(predicted_digit)})

if __name__ == "__main__":
    app.run(debug=True)

# Run the app
