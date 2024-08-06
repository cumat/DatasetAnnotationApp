
from typing import Any
from flask import Flask
from dataset.dataset import Dataset
from backend.database import Database
class App:
    _instance = None
    # @classmethod
    # def get(cls):
    #     if cls._instance is None:
    #         raise Exception("App was not initialized")
    #     else:
    #         return cls._instance
    @classmethod
    def get_db(cls) -> Database:
        if cls._instance is None:
            raise Exception("App was not initialized")
        else:
            return cls._instance.database
    
    @classmethod
    def get_app(cls) -> Flask:
        if cls._instance is None:
            raise Exception("App was not initialized")
        else:
            return cls._instance.app
    @classmethod
    def get_dataset(cls) -> Dataset:
        if cls._instance is None:
            raise Exception("App was not initialized")
        else:
            return cls._instance.dataset

    def __init__(self, name: str, static_folder :str, dataset: Dataset) -> None:
        if App._instance == None:
            self.app = Flask(name, static_folder=static_folder)
            self.dataset = dataset
            self.database = Database()
            App._instance = self
        else:
            raise Exception("App was already created")

    def run(self, port) -> None:
        print("running: ", self.app)
        self.app.run(debug=True, port=port)

