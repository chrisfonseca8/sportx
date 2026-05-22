import cron from 'node-cron';
import { match_duration } from '../Utils/index.js';
import db from '../models/index.js';
import { match_statusEnums } from '../Utils/index.js';
const { LIVE, FINISHED, SCHEDULED } = match_statusEnums;


const { Match } = db;

export const match_cron = () => {

    cron.schedule('*/30 * * * * *', async () => {

        try {

            const matches = await Match.findAll();

            const currentTime = Date.now();

            for (const match of matches) {

                const startTime = new Date(match.StartTime).getTime();

                const durationInMinutes = Number(match_duration);

                //console.log(durationInMinutes);
                console.log(startTime)

                // convert minutes -> milliseconds
                const endTime =
                    startTime + (durationInMinutes * 60 * 1000);

                console.log(endTime);

                if (currentTime > endTime) {

                    await Match.destroy({
                        where: {
                            id: match.id
                        }
                    });

                    console.log(`Deleted match ${match.id}`);

                }

                else if (
                    currentTime >= startTime &&
                    currentTime <= endTime
                ) {

                    if (match.Status === LIVE) {
                        continue;
                    }

                    await Match.update(
                        {
                            Status: LIVE
                        },
                        {
                            where: {
                                id: match.id
                            }
                        }
                    );

                    console.log(`Live match ${match.id}`);

                }


                // console.log("Current:", new Date(currentTime));

                // console.log(
                //     "Start:",
                //     new Date(startTime)
                // );

                // console.log(
                //     "End:",
                //     new Date(endTime)
                // );
            }

        } catch (error) {

            console.log(error);

        }


    });
}