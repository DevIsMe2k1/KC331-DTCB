import { tempRef, pHRef, turbRef, TempMaxRef, TempMinRef, PHMaxRef, PHMinRef, turbMaxRef, turbMinRef } from './main.js';

const SMS = {
    sendSMS(message) {
        fetch("/sendSMS", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(message)
        })
        console.log(message);
    },
    ListenChange(ref, maxref, minref, message) {
        ref.on('value', (liveSnapshot) => {
            maxref.on('value', (maxSnapshot) => {
                minref.on('value', (minSnapshot) => {
                    const liveValue = liveSnapshot.val();
                    const maxValue = maxSnapshot.val();
                    const minValue = minSnapshot.val();

                    if (maxValue < liveValue) {
                        this.sendSMS({"title": message.highValue,
                            "LiveVal": `Giá trị hiện tại : ${liveValue}`,
                            "defaultValue": `Lớn hơn giá trị tối ưu : ${maxValue}`});
                    }

                    if (minValue > liveValue) {
                        this.sendSMS({"title": message.lowValue,
                            "LiveVal": `Giá trị hiện tại :  ${liveValue}`,
                            "defaultValue": `Nhỏ hơn giá trị tối ưu : ${minValue}`});
                    }
                });
            });
        });
    },
    start() {
        const tempMessage = {
            highValue: "Nhiệt độ quá cao",
            lowValue: "Nhiệt độ quá thấp"
        };
        const phMessage = {
            highValue: "Độ PH quá cao",
            lowValue: "Độ PH quá thấp"
        };
        const turbMessage = {
            highValue: "Độ đục quá cao",
            lowValue: "Độ đục quá thấp"
        };
        this.ListenChange(tempRef, TempMaxRef, TempMinRef, tempMessage);
        this.ListenChange(pHRef, PHMaxRef, PHMinRef, phMessage);
        this.ListenChange(turbRef, turbMaxRef, turbMinRef, turbMessage);
    }
};
SMS.start();

