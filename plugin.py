from dataset.dataset import Dataset, Data, HtmlView, TextLabelGroup


def get_dataset() -> Dataset:
    labels = TextLabelGroup()
    labels.add_label("label1").add_label("label2").add_label("label3")
    view = HtmlView()
    view.add_text("first data")
    dataset = Dataset("test-dataset")
    for i in range(1, 10):
        data = Data(i, f"data {i}", view, labels)
        dataset.add_data(data)    
    return dataset