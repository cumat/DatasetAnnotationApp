class DatasetDataResult:
    def __init__(self, id, label) -> None:
        self.id = id
        self.label = label
    def to_dict(self) -> dict:
        return {
            "id" : self.id,
            "label" : self.label
        }
    
class DatasetResults:
    def __init__(self, dataset_name: str) -> None:
        self.dataset: str = dataset_name
        self.results = [] 
    
    def append_result(self, id, label):
        self.results.append(DatasetDataResult(id, label))

    def to_dict(self) -> dict:
        return {
            "dataset" : self.dataset,
            "results" :  [res.to_dict() for res in self.results]
        }