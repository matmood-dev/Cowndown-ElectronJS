import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'antd/dist/reset.css';
import './App.css';
import { Layout, TimePicker, Select, Typography, Space, Button, message, Card, Progress } from 'antd';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

dayjs.extend(duration);
dayjs.extend(customParseFormat);

function App() {
  const [startTime, setStartTime] = useState(null);
  const [workHours, setWorkHours] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [percentage, setPercentage] = useState(0);

  const intervalRef = useRef(null);

  const calculateEndTime = () => {
    if (!startTime || !workHours) return;
    const end = startTime.add(workHours, 'hour');
    setEndTime(end);
    updateTimeLeft(end);
    startCountdown(end);
  };

  const updateTimeLeft = (end) => {
    const now = dayjs();
    const diff = end.diff(now);
    setTimeLeft(dayjs.duration(diff > 0 ? diff : 0));
    const total = end.diff(startTime);
    const remaining = diff > 0 ? diff : 0;
    setPercentage(100 - Math.floor((remaining / total) * 100));

  };

  const startCountdown = (end) => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      updateTimeLeft(end);
    }, 1000);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const formatDuration = (d) => {
    const h = String(d.hours()).padStart(2, '0');
    const m = String(d.minutes()).padStart(2, '0');
    const s = String(d.seconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <>
    <div className="titlebar">
      <div className="titlebar-left">🕒 Work Timer</div>
      <div className="titlebar-right">
        <button onClick={() => window.api.minimize()}>—</button>
        <button onClick={() => window.api.close()}>✕</button>
      </div>
    </div>

    <Layout
  style={{
    height: '568px', // 600px window - 32px custom titlebar
    width: '800px',
    overflow: 'hidden',
    margin: '0 auto',
    borderTop: '1px solid #001529' // optional clean border
  }}
>

      <Content style={{ padding: '1rem 2rem', overflow: 'hidden' }}>
        <Card
  style={{
    width: '100%',
    maxWidth: 400,
    margin: '1rem auto',
    padding: '1rem',
    borderRadius: 16,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  }}
>
  <Space direction="vertical" size="large" style={{ width: '100%' }}>
    <div>
      <Text strong>Start Time:</Text><br />
      <TimePicker
        format="HH:mm"
        onChange={(time) => setStartTime(time)}
        placeholder="Select start time"
        style={{ width: '100%' }}
        disabled={!!endTime}
      />
    </div>

    <div>
      <Text strong>Work Hours:</Text><br />
      <Select
        placeholder="Select shift duration"
        style={{ width: '100%' }}
        onChange={(value) => setWorkHours(value)}
        disabled={!!endTime}
      >
        <Option value={6}>6 Hours</Option>
        <Option value={8}>8 Hours</Option>
        <Option value={8.5}>8.5 Hours</Option>
      </Select>
    </div>

    <Button
      type="primary"
      block
      size="large"
      onClick={() => {
        if (!startTime || !workHours) {
          message.warning('Enter both start time and work hours');
          return;
        }
        calculateEndTime();
      }}
      disabled={!!endTime}
    >
      Calculate End Time
    </Button>

    {endTime && (
      <>
        <Title level={4} style={{ margin: 0 }}>🛑 End Time: {endTime.format('HH:mm')}</Title>
        <Title level={1} style={{ margin: 0, color: '#1677ff' }}>{formatDuration(timeLeft)}</Title>
        <Progress percent={percentage} strokeColor="#52c41a" status="active" />
        <Button block danger size="large" onClick={() => {
          clearInterval(intervalRef.current);
          setStartTime(null);
          setEndTime(null);
          setTimeLeft(null);
          setWorkHours(null);
        }}>
          Reset
        </Button>
      </>
    )}
  </Space>
</Card>

      </Content>
    </Layout>
    </>
  );
}

export default App;
