import { Request, Response, NextFunction } from 'express';
import { GetAttendanceUseCase } from './GetAttendanceUseCase';
const useCase = new GetAttendanceUseCase();
export async function getAttendanceHandler(req: Request, res: Response, next: NextFunction) { try { const { attendanceId } = req.params; const result = await useCase.execute(attendanceId); res.status(200).json({ data: result, message: 'Attendance retrieved successfully' }); } catch (e) { next(e); } }
