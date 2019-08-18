from fastai.imports import *
from fastai.vision import *
from flask import Flask
from flask import request, jsonify
import base64
import json
from PIL import Image
from io import BytesIO
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
path = Path("./")
learn = load_learner(path)

@app.route('/')
def hello_world():
    img = open_image("./test1.png")
    pred_class,pred_idx,outputs = learn.predict(img)
    print(pred_class)
    return "done"

@app.route('/detect', methods=['POST'])
def detect():
     print("detect route hit")
     json_data = request.get_json(force=True)
     data = json_data['image']
     img_bytes = io.BytesIO(base64.b64decode(data))
     img = open_image(img_bytes)
     pred_class,pred_idx,outputs = learn.predict(img)
     print(pred_class, pred_idx, outputs)
     print(pred_class, pred_idx, outputs[0])
     if(pred_idx == 0):
         prediction = "person"
     else:
         prediction = "shooter"
     json_data = json.dumps({'prediction': prediction})
     return json_data 

