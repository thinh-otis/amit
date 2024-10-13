
const Traffic = require('../models/Traffic'); // Đảm bảo bạn đã định nghĩa model

// Hàm để ghi nhận traffic
exports.trackTraffic = async (req, res) => {
    console.log('Track traffic endpoint hit'); 
    const trafficData = new Traffic({
        date: new Date(),
        visits: 1, // Mỗi lần gọi endpoint này coi như một lượt truy cập
    });

    try {
        await trafficData.save();
        res.status(201).send('Traffic recorded');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error recording traffic');
    }
};

// Hàm để lấy dữ liệu traffic
exports.getTrafficData = async (req, res) => {
    try {
        const { timeFrame } = req.query;
        let startDate;
        const endDate = new Date();

        if (timeFrame === 'daily') {
            startDate = new Date();
            startDate.setDate(endDate.getDate() - 7); // Lấy dữ liệu 7 ngày
        } else if (timeFrame === 'weekly') {
            startDate = new Date();
            startDate.setMonth(endDate.getMonth() - 1); // Lấy dữ liệu 1 tháng
        } else if (timeFrame === 'monthly') {
            startDate = new Date();
            startDate.setFullYear(endDate.getFullYear() - 1); // Lấy dữ liệu 1 năm
        }

        const data = await Traffic.find({ date: { $gte: startDate, $lte: endDate } });
        console.log("Retrieved traffic data:", data); // Log dữ liệu
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving traffic data' });
    }
};
