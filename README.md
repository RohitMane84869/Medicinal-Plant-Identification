# 🌿 Medicinal Plant Identification (AI + Deep Learning)
An AI-powered system that identifies medicinal plants from images using **Convolutional Neural Networks (CNNs)** and **EfficientNet Transfer Learning**.  
Designed for students, researchers, and farmers to quickly recognize medicinal plant species with high accuracy.

## 🚀 Features
- 🌱 Identify medicinal plants from leaf/plant images  
- 🤖 EfficientNetB0 deep learning model  
- 🎯 High accuracy using augmentation and transfer learning  
- 🧪 Easy-to-run training and inference scripts  
- 🧩 Modular, clean codebase  
- 📱 Ready for mobile/web deployment  

# 🧠 Tech Stack
- **Python**
- **TensorFlow / Keras**
- **NumPy, Pandas**
- **OpenCV**
- **Matplotlib**
- **Albumentations**

## 📦 Installation
```bash
git clone https://github.com/<your-username>/medicinal-plant-id.git
cd medicinal-plant-id
pip install -r requirements.txt
````
## 🗂 Dataset Setup

Organize your dataset like
data/
 train/
 AloeVera/
 Tulsi/
 Neem/
val/
 test/   
You can use your own dataset or public medicinal plant datasets.

## 🏋️ Train the Model
cd src
python train.py

Training outputs:
saved_models/best_model.h5
saved_models/final_model.h5

## 🔍 Run Prediction (Inference)

cd src
python infer.py ../saved_models/best_model.h5 <image_path>
Example result:
Predicted: Aloe Vera (97.45%)

Recommended screenshots:
<img width="1885" height="915" alt="Screenshot 2025-11-24 103355" src="https://github.com/user-attachments/assets/67fcccaa-3c02-482e-8b42-b515a18bb6d5" />
<img width="1904" height="923" alt="image" src="https://github.com/user-attachments/assets/800eb4f4-d2f6-4309-a532-e654a968e072" />
<img width="1755" height="2021" alt="image" src="https://github.com/user-attachments/assets/373c6b6a-12cb-48ab-88b8-da4c06ff1134" />

Add them inside an **assets/** folder.

## 🤝 Contributing
Contributions are welcome!
* Adding more plant classes
* Improving accuracy
* Creating a mobile app interface
* Writing documentation

## ⭐ Support
If you find this project useful, please ⭐ the repository!
