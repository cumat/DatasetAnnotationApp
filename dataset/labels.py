import sys
import json

class LabelGroup:
    def __init__(self) -> None:
        pass

    def send_json(self) -> dict:
        pass

    def compare(self, data1, data2) -> bool:
        pass

class TextLabelGroup(LabelGroup):
    def __init__(self) -> None:
        self.labels = []

    def add_label(self, label: str):
        self.labels.append(label)
        return self

    def send_json(self) -> dict:
        return {
            "component":"text-labels",
            "data": self.labels
        }
    def compare(self, data1, data2) -> bool:
        if(data1 == data2):
            return True
        else:
            return False

class NumberValueType:
    INT = 1
    FLOAT = 2

class NumberLabelGroup(LabelGroup):
    def __init__(self,min: float = sys.float_info.min, max:float = sys.float_info.max, 
                 value_type : NumberValueType = NumberValueType.FLOAT) -> None:
        self.min = min
        self.max = max
        self.value_type = value_type

    def value_type_to_js(self):
        if self.value_type == NumberValueType.INT:
            return "1"
        else:
            return "0.01"
        
    def send_json(self) -> dict:
        return {
            "component":"number-labels",
            "data": {
                'min' : self.min,
                'max' : self.max,
                'step' : self.value_type_to_js()
            }
        }
    
    def compare(self, data1, data2) -> bool:
        if(self.value_type == NumberValueType.FLOAT):
            if round(float(data1)) == round(float(data2)):
                return True
            else:
                return False
        if(data1 == data2):
            return True
        else:
            return False


class RectData:
    def __init__(self, rect : dict) -> None:
        self.x_min = min(rect['startX'], rect['endX'])
        self.x_max = max(rect['startX'], rect['endX'])
        self.y_min = min(rect['startY'], rect['endY'])
        self.y_max = max(rect['startY'], rect['endY'])

        self.top_left = (self.x_min, self.y_max)
        self.bot_left = (self.x_min, self.y_min)
        self.top_right = (self.x_max, self.y_max)
        self.bot_right = (self.x_max, self.y_min)
    def calculate_area(self, x_min, x_max, y_min, y_max) -> float:
        width = x_max - x_min
        height = y_max - y_min
        return width * height

    def calculate_intersection_area(self, other: 'RectData') -> float:
        x_overlap_min = max(self.x_min, other.x_min)
        x_overlap_max = min(self.x_max, other.x_max)
        y_overlap_min = max(self.y_min, other.y_min)
        y_overlap_max = min(self.y_max, other.y_max)
        
        if x_overlap_min < x_overlap_max and y_overlap_min < y_overlap_max:
            return self.calculate_area(x_overlap_min, x_overlap_max, y_overlap_min, y_overlap_max)
        return 0

    def calculate_union_area(self, other: 'RectData') -> float:
        union_x_min = min(self.x_min, other.x_min)
        union_x_max = max(self.x_max, other.x_max)
        union_y_min = min(self.y_min, other.y_min)
        union_y_max = max(self.y_max, other.y_max)
        
        return self.calculate_area(union_x_min, union_x_max, union_y_min, union_y_max)

    def intersection_percentage(self, other: 'RectData') -> float:
        intersection_area = self.calculate_intersection_area(other)
        union_area = self.calculate_union_area(other)
        
        if union_area == 0:
            return 0
        
        return (intersection_area / union_area)

class ImageLabelGroup(LabelGroup):
    def __init__(self, img_id : str) -> None:
        self.img_id = img_id

    def send_json(self) -> dict:
        return {
            "component":"image-label",
            "data": {
                "imageId" : self.img_id
            }
        }
    def compare(self, data1, data2) -> bool:
        try:
            rect1 = json.loads(data1)
            rect2 = json.loads(data2)
            if not all(key in rect1 for key in ['startX', 'startY', 'endX', 'endY']):
                return False
            if not all(key in rect2 for key in ['startX', 'startY', 'endX', 'endY']):
                return False
            rect1 = RectData(rect1)
            rect2 = RectData(rect2)
            tolerance = 0.6
            
            intersection = rect1.intersection_percentage(rect2)
            print(f'intersection {intersection} tolerance: {tolerance}')
            if  intersection < tolerance:
                return False
            else:
                return True
        except json.JSONDecodeError:
            return False
        
class TimestampLabelGroup(LabelGroup):
    def __init__(self, media_id : str) -> None:
        self.media_id = media_id

    def send_json(self) -> dict:
        return {
            "component":"timestamp-label",
            "data": {
                "mediaId" : self.media_id
            }
        }
    def compare(self, data1, data2) -> bool:
        try:
            # Parse the JSON strings into dictionaries
            dict1 : dict = json.loads(data1)
            dict2 : dict = json.loads(data2)
        except json.JSONDecodeError:
            # Handle JSON parsing errors
            return False
        tolerance = 1.5
        # Extract start and end values from both dictionaries
        start1 = dict1.get('start', 0)
        end1 = dict1.get('end', 0)
        start2 = dict2.get('start', 0)
        end2 = dict2.get('end', 0)

        # Check if start and end values are within the specified tolerance
        start_equal = abs(start1 - start2) <= tolerance
        end_equal = abs(end1 - end2) <= tolerance

        return start_equal and end_equal
    
class MultiImageLabelGroup(LabelGroup):
    def __init__(self, image_id: str, labels: list[str]) -> None:
        self.image_id = image_id
        self.labels = labels.copy()

    def add_label(self, label : str):
        self.labels.append(label)

    def send_json(self) -> dict:
        return {
            "component":"multi-image-label",
            "data": {
                "imageId" : self.image_id,
                "labels" : self.labels
            }
        }
    
    def compare(self, data1, data2) -> bool:
        try:
            rects1 = json.loads(data1)
            rects2 = json.loads(data2)

            # Check if both datasets are lists
            if not isinstance(rects1, list) or not isinstance(rects2, list):
                return False
            
            # Check if each rectangle has the required keys
            for rect in rects1 + rects2:
                if not all(key in rect for key in ['startX', 'startY', 'endX', 'endY', 'label']):
                    return False

            # Create dictionaries to count rectangles by label
            label_count1 = {}
            label_count2 = {}
            tolerance = 0.6
            for rect in rects1:
                label = rect['label']
                if label not in label_count1:
                    label_count1[label] = []
                label_count1[label].append(RectData(rect))

            for rect in rects2:
                label = rect['label']
                if label not in label_count2:
                    label_count2[label] = []
                label_count2[label].append(RectData(rect))

            # Check if both datasets have the same labels with the same counts
            if label_count1.keys() != label_count2.keys():
                return False
            
            # Check if both data have the same number of rectangles for each label
            for label in label_count1:
                if len(label_count1[label]) != len(label_count2[label]):
                    return False
            for label in label_count1:
                if len(label_count1[label]) != len(label_count2[label]):
                    return False

                # Check if each rectangle in label_count1[label] intersects with at least one in label_count2[label]
                for rect1 in label_count1[label]:
                    has_intersection = any(
                        rect1.intersection_percentage(rect2) >= tolerance
                        for rect2 in label_count2[label]
                    )
                    if not has_intersection:
                        return False

            # If all checks are passed, return True
            return True

        except json.JSONDecodeError:
            return False

class MultiTimestampLabelGroup(LabelGroup):
    def __init__(self, mediaId: str, labels: list[str]) -> None:
        self.mediaId = mediaId
        self.labels = labels.copy()

    def add_label(self, label : str):
        self.labels.append(label)

    def send_json(self) -> dict:
        return {
            "component":"multi-timestamp-label",
            "data": {
                "mediaId" : self.mediaId,
                "labels" : self.labels
            }
        }
    
    def compare(self, data1, data2) -> bool:
        
        return False