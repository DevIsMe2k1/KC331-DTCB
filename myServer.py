from flask import Flask, render_template, request, jsonify, send_from_directory
from Model.WaterParametersPredict import myModel
from twilio.rest import Client
import twilioKey
client = Client(twilioKey.account_sid, twilioKey.auth_token)

app = Flask(__name__)

def send_sms(_body):
    client.messages.create(
        body= _body,
        from_=twilioKey.twilio_number,
        to=twilioKey.target_number
        )
@app.route("/")
def index():
    return render_template("index.html")
@app.route("/sendSMS", methods=["POST"])
def sendSMS():
    try:
        data = request.json
        title = data["title"]
        content1 = data["LiveVal"]
        content2 = data["defaultValue"]
        # send_sms(title + content1 + content2)
        return "SMS sent successfully"
    except Exception as e:
        return f"Error: {str(e)}", 500
@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    new_data_point = data["new_data_point"]
    # Thực hiện dự đoán bằng mô hình đã huấn luyện
    prediction = myModel(new_data_point)
    return jsonify(prediction.tolist())
# Cấu hình máy chủ Flask để phục vụ các tệp tĩnh từ thư mục "static"

@app.route("/static/<path:filename>")
def serve_static(filename):
    return send_from_directory("static", filename)


if __name__ == "__main__":
    app.run(debug=True, port=5500)
