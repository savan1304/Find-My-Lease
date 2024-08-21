import React, {useContext} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../Config/Colors';
import { AuthContext } from '../Components/AuthContext';

const Visit = ({ visit }) => {
    const { language } = useContext(AuthContext);
    let visitStatus = visit.status
    let status = visitStatus.charAt(0).toUpperCase() + visitStatus.slice(1);
    return (
        <View>
    <Text style={styles.info}>{language === 'zh' ? '位置：' : 'Location: '}{visit.listingLocation}</Text>
    <Text style={styles.info}>{language === 'zh' ? '价格：' : 'Price: '}C$ {visit.listingPrice}/mo</Text>
    <Text style={styles.info}>{language === 'zh' ? '日期：' : 'Date: '}{visit.date}</Text>
    <Text style={styles.info}>{language === 'zh' ? '时间：' : 'Time: '}{visit.time}</Text>
    <Text style={styles.info}>{language === 'zh' ? '疑问' : 'Questions: '}{visit.questions}</Text>
    {visit.setReminder ? (
        <Text style={styles.info}>{language === 'zh' ? '已设置提醒：是' : 'Reminder set: Yes'}</Text>
    ) : (
        <Text style={styles.info}>{language === 'zh' ? '已设置提醒：否' : 'Reminder set: No'}</Text>
    )}
    <View style={styles.statusContainer}>
        <Text style={styles.info}>{language === 'zh' ? '状态：' : 'Status: '}</Text>
        <Text style={[styles.info, { color: status === 'Approved' ? Colors.green : status === 'Rescheduled' ? Colors.yellow : '#666', fontWeight: '600' }]}>
            {status === 'Approved' ? (language === 'zh' ? '已批准' : 'Approved') : status === 'Rescheduled' ? (language === 'zh' ? '已重新安排' : 'Rescheduled') : status}
        </Text>
    </View>
</View>
    );
};

const styles = StyleSheet.create({
    info: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    statusContainer: {
        flexDirection: 'row'
    }
});

export default Visit;