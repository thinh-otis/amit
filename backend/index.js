require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const router = require('./routes');
const Traffic = require('./models/Traffic');
const path = require('path');


const app = express();

app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Kiểm tra biến môi trường
if (!process.env.FRONTEND_URL) {
    console.error('FRONTEND_URL is not defined in .env');
    process.exit(1); // Dừng server nếu không có biến môi trường
}

// Cors
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan('dev')); 
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Endpoint để lấy dữ liệu lượng truy cập
app.get('/api/traffic-data', async (req, res) => {
    try {
        const data = await Traffic.find({});
        res.json(data);
    } catch (error) {
        console.error('Error fetching traffic data:', error);
        res.status(500).json({ message: 'Error fetching traffic data' });
    }
});

// Route để ghi nhận traffic
app.post('/api/track-traffic', async (req, res) => {
    try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const trafficData = await Traffic.find();
        const monthlyData = trafficData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
        });

        if (monthlyData.length === 0) {
            await Traffic.deleteMany({});
        }

        const newTraffic = new Traffic({
            date: currentDate,
            visits: 1,
        });

        await newTraffic.save();
        res.status(201).send('Traffic recorded successfully');
    } catch (error) {
        console.error('Error tracking traffic', error);
        res.status(500).send('Error tracking traffic');
    }
});

// Kết nối với MongoDB và khởi động server
const startServer = async () => {
    try {
        await connectDB();
        console.log("MongoDB connected successfully");

        // Thêm dữ liệu mẫu nếu chưa có dữ liệu
        const count = await Traffic.countDocuments();
        if (count === 0) {
            await Traffic.insertMany([
                { date: new Date('2024-10-01'), visits: 100 },
                { date: new Date('2024-10-02'), visits: 150 },
                { date: new Date('2024-10-03'), visits: 200 }
            ]);
            console.log("Sample traffic data added.");
        }

        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1);
    }
};

// Routes
app.use("/api", router);

// Xử lý lỗi
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Route để phục vụ index.html cho tất cả các yêu cầu không phải API
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Khởi động server
startServer();

