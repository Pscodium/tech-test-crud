import app from "./app.js";
import { environment } from './config/environment.js';

app.listen(3000, (err) => {
    if (err) {
        console.log('[SERVER] Error on server start - ', err);
        return
    }
    console.log(`[SERVER] - Server is running on port ${environment.server.port}`);
});