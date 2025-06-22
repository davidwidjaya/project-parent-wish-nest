import { Injectable } from '@nestjs/common';
// import { CreateChildrens } from './dto/create-children.dto';
import { AppDataSource } from 'data-source/data-source';
import { Children } from './entity/children.entity';
import { CreateChildrensDto } from './dto/create-children.dto';

@Injectable()
export class ChildrenService {


    async createChildrens (dto:CreateChildrensDto , userId : number){
                return await AppDataSource.transaction(async (manager) => {
                    const childrenRepo = manager.getRepository(Children);
        
                    const data = {
                        ...dto,
                        user_id : userId
                        // password: hashedPassword,
                        // step: "step_verif_code",
                    };
        
                    const user = childrenRepo.create(data);
        
                    const save = await childrenRepo.save(user);
        
                    return save;
                });
        
    }
}
