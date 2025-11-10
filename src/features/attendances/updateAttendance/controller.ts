import { Request, Response, NextFunction } from 'express';
import { UpdateAttendanceUseCase } from './UpdateAttendanceUseCase';
const useCase = new UpdateAttendanceUseCase();
export async function updateAttendanceHandler(req: Request, res: Response, next: NextFunction) { try { const { attendanceId } = req.params; const result = await useCase.execute(attendanceId, req.body); res.status(200).json({ data: result, message: 'Attendance updated successfully' }); } catch (e) { next(e); } }
