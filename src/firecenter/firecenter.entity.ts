import { Column, Entity, Geometry, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: 'mjh', name: 'firecenter' })
export class firecenter{

    @PrimaryGeneratedColumn()
    fc_id: number;    // 소방서 ID

    @Column({ type: 'geometry', nullable: false })
    fc_geom: Geometry;  // 소방서 지오메트리

    @Column({ type: 'integer', nullable: false })
    fc_unq_id: number; // 서 센터 ID

    @Column({ type: 'text', nullable: false })
    fc_nm: string;     // 소방서명

    @Column({ type: 'text', nullable: false })
    fc_type_nm: string; // 유형구분명

    @Column({ type: 'integer', nullable: false })
    fz_lgnd_id: number;   // 상위 서 센터 ID

    @Column({ type: 'integer', nullable: false })
    fc_number: number;       // 일련번호

}