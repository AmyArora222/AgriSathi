# 🌾 Agricultural Voice Assistant

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/atlas)
[![LiveKit](https://img.shields.io/badge/LiveKit-WebRTC-orange.svg)](https://livekit.io/)
[![Google AI](https://img.shields.io/badge/Google-Gemini%20Live-red.svg)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> An intelligent **voice-first AI assistant** designed specifically for agricultural services in India. Built with **Google Gemini Live**, **LiveKit**, and **MongoDB Atlas** for seamless voice interactions and expert query management.

## 🎯 Key Features

### 🎙️ **Advanced Voice Capabilities**
- **Google Gemini Live Integration**: Native voice input/output with real-time processing
- **Hindi & English Support**: Bilingual conversations with seamless language switching  
- **Smart Speech Recognition**: Optimized for Indian accents and agricultural terminology
- **Low Latency**: Sub-second response times for natural conversations

### 🌾 **Agricultural Expertise**
- **Expert Query Creation**: Voice-guided step-by-step query collection
- **Crop Price Checking**: Real-time market prices via Government of India API
- **Query Status Tracking**: Monitor progress with unique 6-character tracking codes
- **Mobile-based Lookup**: Find all queries associated with a phone number

### 🗄️ **Production-Ready Database**
- **MongoDB Atlas**: Cloud-native document database with auto-scaling
- **Smart Indexing**: Optimized for fast query retrieval and status updates
- **Data Validation**: Comprehensive input validation for Indian mobile numbers
- **Real-time Updates**: Live status tracking and expert assignment

## 📁 Project Structure

```
agricultural-voice-assistant/
├── src/
│   ├── agent.py              # Main LiveKit + Google Gemini Live integration
│   ├── api.py                # Assistant class with function tools  
│   └── db_driver.py          # MongoDB operations and query management
├── ai/                       # Virtual environment (auto-created)
├── KMS/
│   └── logs/                 # Application logs directory
├── requirements.txt          # Python dependencies (optimized)
├── README.md                 # This documentation
├── .env                      # Environment variables (create this)
├── .gitignore               # Git ignore patterns (recommended)
└── LICENSE                  # MIT License (recommended)
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.9+** (tested with Python 3.12)
- **MongoDB Atlas account** (free tier sufficient)
- **LiveKit Cloud account** ([Get started free](https://cloud.livekit.io/))
- **Google AI API key** ([Get API key](https://ai.google.dev/))

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/agricultural-voice-assistant.git
cd agricultural-voice-assistant
```

### 2. Setup Virtual Environment
```bash
# Create virtual environment
python -m venv ai

# Activate (Windows)
ai\Scripts\activate

# Activate (Linux/Mac)  
source ai/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Configuration
Create `.env` file in project root:

```bash
# MongoDB Atlas (REQUIRED)
MONGODB_CONNECTION_STRING=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

# LiveKit (REQUIRED)
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret

# Google AI (REQUIRED)  
GOOGLE_API_KEY=your-google-ai-api-key

# Government API (OPTIONAL - for crop prices)
GOV_API_KEY=your-government-api-key
GOV_API_URL=https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
```

### 5. Run the Assistant
```bash
python src/agent.py
```

## 🎙️ Voice Conversation Examples

### Creating Expert Query (Hindi)
```
👤 User: "मुझे एक विशेषज्ञ से बात करनी है"
🤖 Krishi: "अपना नाम बताएं"

👤 User: "मेरा नाम राज कुमार है"  
🤖 Krishi: "अपना मोबाइल नंबर बताएं - अंक एक-एक करके"

👤 User: "9 8 7 6 5 4 3 2 1 0"
🤖 Krishi: "अपना पूरा पता बताएं"

👤 User: "कानपुर, उत्तर प्रदेश"
🤖 Krishi: "क्या समस्या है?"

👤 User: "गेहूं की फसल में बीमारी है"
🤖 Krishi: "आपका अनुरोध बन गया! ट्रैकिंग कोड: AB123C"
```

### Checking Query Status
```
👤 User: "Check status AB123C"
🤖 Krishi: "Request Code: AB123C
            Name: राज कुमार  
            Status: Expert assigned: Dr. Sharma
            Created: 2025-07-22 14:30:00"
```

### Crop Price Inquiry
```
👤 User: "What is tomato price in Maharashtra?"
🤖 Krishi: "Tomato Prices
            Location: Maharashtra
            Found 3 records:
            1. Mumbai Market: ₹25 per kg
            2. Pune Market: ₹23 per kg  
            3. Nashik Market: ₹22 per kg"
```

## 🔧 Technical Implementation

### Core Function Tools

#### 🎯 `create_query(name, mobile, location, description)`
**Voice-guided query collection with validation:**
- ✅ Indian mobile validation (10+ digits, starts with 6/7/8/9)
- ✅ Complete location requirement (village, district, state)
- ✅ Unique 6-character hex tracking codes  
- ✅ UTC timestamps for global compatibility

#### 📊 `check_status(request_code)`
**Comprehensive status tracking:**
- ✅ Query lookup by tracking code
- ✅ Expert assignment details
- ✅ Status progression monitoring
- ✅ Creation date and notes display

#### 💰 `check_crop_prices(commodity, state, market)`
**Government API integration:**
- ✅ 20+ supported crops (wheat, rice, onion, tomato, etc.)
- ✅ State-wise and market-specific pricing
- ✅ Real-time Government of India data
- ✅ Graceful fallback for API issues

### Database Schema

```javascript
// MongoDB Collection: queries
{
  "_id": ObjectId("..."),
  "request_code": "AB123C",        // 6-char hex (unique)
  "name": "राज कुमार",
  "mobile": "9876543210",          // Validated & cleaned
  "location": "कानपुर, उत्तर प्रदेश",
  "description": "गेहूं की फसल में बीमारी है",
  "status": "pending",             // pending|assigned|completed
  "created_at": ISODate("2025-07-22T12:30:00Z"),
  "expert_assigned": null,         // Expert name when assigned
  "notes": null                    // Expert notes & updates
}
```

### Performance Features
- **Auto-indexing**: `request_code` (unique), `mobile`, `created_at`
- **Connection pooling**: Efficient MongoDB Atlas connections
- **Input validation**: Comprehensive data sanitization
- **Error recovery**: Graceful handling of network issues

## 🔐 Security & Privacy

### Data Protection
- ✅ **Input Validation**: SQL injection prevention
- ✅ **Mobile Privacy**: Last 4 digits only in logs  
- ✅ **Secure Storage**: MongoDB Atlas encryption at rest
- ✅ **API Security**: Environment variable configuration

### Indian Compliance
- ✅ **Data Residency**: MongoDB Atlas India regions
- ✅ **Mobile Validation**: Indian number format (6/7/8/9 prefix)
- ✅ **Language Support**: Hindi primary, English secondary
- ✅ **Government APIs**: Official price data integration

## 🧪 Testing & Validation

### Manual Testing
```bash
# Test database connectivity
python -c "
from src.db_driver import db_manager
if db_manager:
    print('✅ Database: Connected')
    code = db_manager.create_query('Test User', '9876543210', 'Test Location', 'Test query')
    print(f'✅ Query Creation: {code}')
    status = db_manager.get_query_status(code)
    print(f'✅ Status Retrieval: {status[\"status\"] if status else \"Failed\"}')
else:
    print('❌ Database: Connection failed')
"
```

### Voice Assistant Testing
```bash
# Start voice assistant
python src/agent.py

# Test conversation flow:
# 1. "I need help from an expert"
# 2. Provide: Name → Mobile → Location → Problem
# 3. Verify: Tracking code generated
# 4. Test: "Check status [CODE]"
```

## 🔧 Troubleshooting

<details>
<summary><strong>MongoDB Connection Issues</strong></summary>

**Symptoms**: `Failed to initialize database`

**Solutions**:
1. Check `.env` has correct `MONGODB_CONNECTION_STRING`
2. Verify MongoDB Atlas cluster is awake (free tier sleeps)
3. Whitelist IP address in Atlas Network Access
4. Test: Visit Atlas dashboard to wake cluster

**Quick Fix**:
```bash
# Test connection manually
python -c "
import pymongo, os
from dotenv import load_dotenv
load_dotenv()
client = pymongo.MongoClient(os.getenv('MONGODB_CONNECTION_STRING'))
print('Atlas Status:', client.admin.command('ping'))
"
```
</details>

<details>
<summary><strong>Voice Recognition Problems</strong></summary>

**Symptoms**: Bot doesn't understand speech correctly

**Solutions**:
1. **Clear Speech**: Speak slowly and clearly
2. **Mobile Numbers**: Say digits one-by-one "9... 8... 7..."
3. **Environment**: Use quiet room with good microphone
4. **Language**: Use simple Hindi/English words
5. **Follow Flow**: Wait for bot to finish before responding

**Audio Setup**:
- Use wired headset for better quality
- Test microphone in system settings first
- Ensure proper internet connection for real-time processing
</details>

<details>
<summary><strong>Function Tool Issues</strong></summary>

**Symptoms**: Bot responds but doesn't create queries

**Root Cause**: Incomplete conversation flow

**Solutions**:
1. **Complete Info**: Provide all 4 fields (name, mobile, location, description)
2. **Exact Flow**: Follow name → mobile → location → problem sequence  
3. **Clear Intent**: Use phrases like "I need expert help"
4. **Patience**: Allow bot to ask for each piece of information

**Debug Mode**:
```python
# Add to src/api.py for debugging
import logging
logging.getLogger("api").setLevel(logging.DEBUG)
```
</details>

## 📈 Performance & Scaling

### Optimizations Made
- **Dependencies**: Reduced from 35+ to 8 essential packages
- **MongoDB**: Optimized queries with proper indexing  
- **Voice Processing**: Native Gemini Live (no separate TTS/STT)
- **Error Handling**: Comprehensive validation and recovery
- **Logging**: Reduced verbosity for production use

### Production Deployment
```bash
# For production deployment
pip install gunicorn  # WSGI server
gunicorn --bind 0.0.0.0:8000 src.agent:app
```

### Scaling Considerations
- **MongoDB Atlas**: Auto-scales with traffic
- **LiveKit**: Supports concurrent voice sessions
- **Google Gemini**: Rate limiting considerations
- **Government API**: Caching for price data

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

### Development Setup
```bash
# Fork the repository
git clone https://github.com/yourusername/agricultural-voice-assistant.git
cd agricultural-voice-assistant

# Create feature branch
git checkout -b feature/your-feature-name

# Install dependencies
pip install -r requirements.txt

# Make changes and test
python src/agent.py

# Submit pull request
```

### Code Style
- **Python**: Follow PEP 8 guidelines
- **Comments**: Hindi/English for agricultural terms
- **Functions**: Comprehensive docstrings
- **Testing**: Manual testing with voice conversations

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- **Google AI**: Gemini Live API for voice processing
- **LiveKit**: WebRTC framework for real-time communication
- **MongoDB**: Atlas cloud database platform  
- **Government of India**: Open data APIs for crop prices
- **Indian Farmers**: Inspiration and feedback for this project

## 📞 Support & Contact

### Getting Help
1. **Issues**: [GitHub Issues](https://github.com/yourusername/agricultural-voice-assistant/issues)
2. **Discussions**: [GitHub Discussions](https://github.com/yourusername/agricultural-voice-assistant/discussions)
3. **Documentation**: This README + inline code comments

### Project Status
- **Voice Assistant**: ✅ Production Ready
- **Database**: ✅ MongoDB Atlas Integrated  
- **Price API**: ✅ Government Data Connected
- **Security**: ✅ Input Validation Complete
- **Testing**: ✅ Manual Testing Verified

---

<div align="center">

**🌾 Built for Indian Farmers**  
*Empowering agricultural communities with AI-powered voice assistance*

[![GitHub stars](https://img.shields.io/github/stars/yourusername/agricultural-voice-assistant?style=social)](https://github.com/yourusername/agricultural-voice-assistant/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/agricultural-voice-assistant?style=social)](https://github.com/yourusername/agricultural-voice-assistant/network/members)

*Made with ❤️ for the farming community*

</div> 