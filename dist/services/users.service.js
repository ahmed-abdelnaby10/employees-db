var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from '../models/user.model.js';
export const searchUsers = (searchText) => __awaiter(void 0, void 0, void 0, function* () {
    const pipeline = [
        {
            $search: {
                index: 'project-2.users',
                text: {
                    query: searchText,
                    path: ['name', 'email'],
                    fuzzy: {}
                }
            }
        },
        {
            $project: {
                name: 1,
                email: 1
            }
        }
    ];
    const users = yield User.aggregate(pipeline);
    return {
        total: users.length,
        users
    };
});
