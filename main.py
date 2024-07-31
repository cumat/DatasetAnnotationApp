from backend.app import App
from dataset.dataset import Dataset
from plugin import get_dataset


if __name__ == '__main__':
    # get dataset
    dataset = get_dataset()
    # initialize app
    app = App(__name__, './frontend', dataset)
    # import routes
    from backend.routes import register_blueprint
    # register routes
    register_blueprint()
    # run the app
    app.run()