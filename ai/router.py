from fastai.imports import *
from fastai.vision import *
from flask import Flask

app = Flask(__name__)
path = Path("./")
learn = load_learner(path)

@app.route('/')
def hello_world():
    img = open_image("./test1.png")
    pred_class,pred_idx,outputs = learn.predict(img)
    print(pred_class)
    return "done"
