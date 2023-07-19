import React from 'react';

import { css } from '@linaria/core';

import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Window } from '@app/shared/components';
import { EpochStatsSection, ProposalsList } from '@app/containers/Main/components';
import { PROPOSALS, ROUTES } from '@app/shared/constants';
import { selectPrevProposals } from '../../store/selectors';

interface locationProps {
  filter: number;
}

const StatsSectionClass = css`
  margin-bottom: 40px;
`;

const EpochsPrevious: React.FC = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const state = location.state as locationProps;
  const prevProposals = useSelector(selectPrevProposals());

  const handlePrevious: React.MouseEventHandler = () => {
    navigate(ROUTES.MAIN.EPOCHS);
  };

  return (
    <>
      <Window onPrevious={handlePrevious}>
        <EpochStatsSection state="none" className={StatsSectionClass} />
        <ProposalsList
          filter={state ? state.filter : null}
          isFuture
          type={PROPOSALS.PREV}
          title="Proposals"
          data={[]}
          extendedData={prevProposals.items}
        />
      </Window>
    </>
  );
};

export default EpochsPrevious;
