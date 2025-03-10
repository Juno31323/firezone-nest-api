import { Column, Entity, Geometry, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: 'mjh', name: 'firezone' })
export class firezone {
    @PrimaryGeneratedColumn()
    fz_id: number;    // 소방차전용구역ID

    @Column({ type: 'text', nullable: false })
    fz_near_id: string;    // 동번호

    @Column({ type: 'integer', nullable: false })
    fz_loc_sn: number;     // 전용구역위치구분코드

    @Column({ type: 'text', nullable: false })
    si_nm: string;     // 시도명

    @Column({ type: 'text', nullable: false })
    sig_nm: string;     // 시군구명

    @Column({ type: 'integer', nullable: false })
    sig_sn: number; // 시군구코드

    @Column({ type: 'text', nullable: false })
    road_nm_addr: string;   // 도로명주소

    @Column({ type: 'text', nullable: false })
    bldg_num_addr: string;   // 지번주소

    @Column({ type: 'integer', nullable: false })
    fz_pk_unit: number;    // 전용주차단위구획수

    @Column({ type: 'geometry', nullable: false })
    fz_geom: Geometry;  // 소방차전용구역 지오메트리

    @Column({ type: 'text', nullable: true })
    fz_jur_bldg_ph: string; // 공동주택관리소전화번호

    @Column({ type: 'text', nullable: false })
    fz_jur_nm: string; // 관할소방서명

    @Column({ type: 'text', nullable: false })
    fz_jur_ph: string;   // 관할소방서전화번호

    @Column({ type: 'text', nullable: false })
    crt_dt: Date;       // 데이터 기준일자자

}