
export default function errorMiddleware (err, _req, res) {
    console.error(err);
    res.status(500).json({ error: err.message, stack: err.stack }); 
}