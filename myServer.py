from flask import Flask, render_template, request, jsonify, send_from_directory
from Model.WaterParametersPredict import myModel

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

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
