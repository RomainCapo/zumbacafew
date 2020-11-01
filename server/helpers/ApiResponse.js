export default function notFoundError(res, msg) {
    const data = {
        'message': msg
    }
    return res.status(404).json(data);
}