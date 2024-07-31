from dataset.dataset import Dataset, Data, HtmlView, TextLabelGroup


def get_dataset() -> Dataset:
    labels = TextLabelGroup()
    labels.add_label("label1").add_label("label2").add_label("label3")
    view = HtmlView()
    view.add_text("first data")
    data = Data("0", "first data", view, labels)
    dataset = Dataset("test-dataset")
    dataset.add_data(data)
    
    return dataset